import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getActionColor, getDisplayName, getSignalColor, getStatusIcon } from './output-tab-utils';
import { ReasoningContent } from './reasoning-content';
import { useTranslation } from '@/contexts/language-context';

type TranslateFn = ReturnType<typeof useTranslation>['t'];

// Progress Section Component
function ProgressSection({ sortedAgents, t }: { sortedAgents: [string, any][]; t: TranslateFn }) {
  if (sortedAgents.length === 0) return null;

  return (
    <Card className="bg-transparent mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{t('agent.output.progress.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {sortedAgents.map(([agentId, data]) => {
            const { icon: StatusIcon, color } = getStatusIcon(data.status);
            const displayName = getDisplayName(agentId);
            
            return (
              <div key={agentId} className="flex items-center gap-2">
                <StatusIcon className={cn("h-4 w-4 flex-shrink-0", color)} />
                <span className="font-medium">{displayName}</span>
                {data.ticker && (
                  <span>[{data.ticker}]</span>
                )}
                <span className={cn("flex-1", color)}>
                  {data.message || data.status}
                </span>
                {data.timestamp && (
                  <span className="text-muted-foreground text-xs">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Summary Section Component
function SummarySection({ outputData, t }: { outputData: any; t: TranslateFn }) {
  if (!outputData) return null;

  return (
    <Card className="bg-transparent mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{t('agent.output.summary.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('agent.output.summary.columns.ticker')}</TableHead>
              <TableHead>{t('agent.output.summary.columns.action')}</TableHead>
              <TableHead>{t('agent.output.summary.columns.quantity')}</TableHead>
              <TableHead>{t('agent.output.summary.columns.confidence')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(outputData.decisions).map(([ticker, decision]: [string, any]) => (
              <TableRow key={ticker}>
                <TableCell className="font-medium">{ticker}</TableCell>
                <TableCell>
                  <span className={cn("font-medium", getActionColor(decision.action || ''))}>
                    {decision.action?.toUpperCase() || t('agent.output.unknown')}
                  </span>
                </TableCell>
                <TableCell>{decision.quantity || 0}</TableCell>
                <TableCell>{decision.confidence?.toFixed(1) || 0}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Analysis Results Section Component
function AnalysisResultsSection({ outputData, t }: { outputData: any; t: TranslateFn }) {
  // Always call hooks at the top of the function
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  
  // Calculate tickers (safe to do even if outputData is null)
  const tickers = outputData?.decisions ? Object.keys(outputData.decisions) : [];
  
  // Set default selected ticker
  useEffect(() => {
    if (tickers.length > 0 && !selectedTicker) {
      setSelectedTicker(tickers[0]);
    }
  }, [tickers, selectedTicker]);

  // Early returns after all hooks are called
  if (!outputData) return null;
  if (tickers.length === 0) return null;

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle className="text-lg">{t('agent.output.analysis')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTicker} onValueChange={setSelectedTicker} className="w-full">
          <TabsList className="flex space-x-1 bg-muted p-1 rounded-lg mb-4">
            {tickers.map((ticker) => (
              <TabsTrigger 
                key={ticker} 
                value={ticker} 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors data-[state=active]:active-bg data-[state=active]:text-blue-500 data-[state=active]:shadow-sm text-primary hover:text-primary hover-bg"
              >
                {ticker}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tickers.map((ticker) => {
            const decision = outputData.decisions![ticker];

            return (
              <TabsContent key={ticker} value={ticker} className="space-y-4">
                {/* Agent Analysis */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('agent.output.analysis.columns.agent')}</TableHead>
                      <TableHead>{t('agent.output.analysis.columns.signal')}</TableHead>
                      <TableHead>{t('agent.output.analysis.columns.confidence')}</TableHead>
                      <TableHead>{t('agent.output.analysis.columns.reasoning')}</TableHead>
                    </TableRow>
                  </TableHeader>
                                     <TableBody>
                     {Object.entries(outputData.analyst_signals || {})
                       .filter(([agent, signals]: [string, any]) => 
                         ticker in signals && !agent.includes("risk_management")
                       )
                       .sort(([agentA], [agentB]) => agentA.localeCompare(agentB))
                       .map(([agent, signals]: [string, any]) => {
                        const signal = signals[ticker];
                        const signalType = signal.signal?.toUpperCase() || 'UNKNOWN';
                        const signalColor = getSignalColor(signalType);
                        const signalLabel = (() => {
                          switch (signalType) {
                            case 'BULLISH':
                              return t('signals.bullish');
                            case 'BEARISH':
                              return t('signals.bearish');
                            case 'NEUTRAL':
                              return t('signals.neutral');
                            default:
                              return signalType === 'UNKNOWN' ? t('agent.output.unknown') : signalType;
                          }
                        })();
                        
                        return (
                          <TableRow key={agent}>
                            <TableCell className="font-medium">
                              {getDisplayName(agent)}
                            </TableCell>
                            <TableCell>
                              <span className={cn("font-medium", signalColor)}>
                                {signalLabel}
                              </span>
                            </TableCell>
                            <TableCell>{signal.confidence || 0}%</TableCell>
                            <TableCell className="max-w-md">
                              <ReasoningContent content={signal.reasoning} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
                
                {/* Trading Decision */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('agent.output.analysis.details.property')}</TableHead>
                      <TableHead>{t('agent.output.analysis.details.value')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('agent.output.summary.columns.action')}</TableCell>
                      <TableCell>
                        <span className={cn("font-medium", getActionColor(decision.action || ''))}>
                          {decision.action?.toUpperCase() || t('agent.output.unknown')}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('agent.output.summary.columns.quantity')}</TableCell>
                      <TableCell>{decision.quantity || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('agent.output.summary.columns.confidence')}</TableCell>
                      <TableCell>{decision.confidence?.toFixed(1) || 0}%</TableCell>
                    </TableRow>
                    {decision.reasoning && (
                      <TableRow>
                        <TableCell className="font-medium">{t('agent.output.analysis.columns.reasoning')}</TableCell>
                        <TableCell className="max-w-md">
                          <ReasoningContent content={decision.reasoning} />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Main component for regular output
export function RegularOutput({ 
  sortedAgents, 
  outputData 
}: { 
  sortedAgents: [string, any][]; 
  outputData: any; 
}) {
  const { t } = useTranslation();

  return (
    <>
      <ProgressSection sortedAgents={sortedAgents} t={t} />
      <SummarySection outputData={outputData} t={t} />
      <AnalysisResultsSection outputData={outputData} t={t} />
    </>
  );
}
