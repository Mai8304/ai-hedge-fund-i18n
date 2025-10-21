import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiKeysService } from '@/services/api-keys-api';
import { Eye, EyeOff, Key, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/contexts/language-context';

interface ApiKeyDefinition {
  key: string;
  labelKey: string;
  descriptionKey: string;
  url: string;
  placeholder: string;
}

const FINANCIAL_API_KEYS: ApiKeyDefinition[] = [
  {
    key: 'FINANCIAL_DATASETS_API_KEY',
    labelKey: 'settings.apiKeys.financial.keys.datasets.label',
    descriptionKey: 'settings.apiKeys.financial.keys.datasets.description',
    url: 'https://financialdatasets.ai/',
    placeholder: 'your-financial-datasets-api-key'
  }
];

const LLM_API_KEYS: ApiKeyDefinition[] = [
  {
    key: 'ANTHROPIC_API_KEY',
    labelKey: 'settings.apiKeys.llm.keys.anthropic.label',
    descriptionKey: 'settings.apiKeys.llm.keys.anthropic.description',
    url: 'https://anthropic.com/',
    placeholder: 'your-anthropic-api-key'
  },
  {
    key: 'DEEPSEEK_API_KEY',
    labelKey: 'settings.apiKeys.llm.keys.deepseek.label',
    descriptionKey: 'settings.apiKeys.llm.keys.deepseek.description',
    url: 'https://deepseek.com/',
    placeholder: 'your-deepseek-api-key'
  },
  {
    key: 'GROQ_API_KEY',
    labelKey: 'settings.apiKeys.llm.keys.groq.label',
    descriptionKey: 'settings.apiKeys.llm.keys.groq.description',
    url: 'https://groq.com/',
    placeholder: 'your-groq-api-key'
  },
  {
    key: 'GOOGLE_API_KEY',
    labelKey: 'settings.apiKeys.llm.keys.google.label',
    descriptionKey: 'settings.apiKeys.llm.keys.google.description',
    url: 'https://ai.dev/',
    placeholder: 'your-google-api-key'
  },
  {
    key: 'OPENAI_API_KEY',
    labelKey: 'settings.apiKeys.llm.keys.openai.label',
    descriptionKey: 'settings.apiKeys.llm.keys.openai.description',
    url: 'https://platform.openai.com/',
    placeholder: 'your-openai-api-key'
  },
  {
    key: 'OPENROUTER_API_KEY',
    labelKey: 'settings.apiKeys.llm.keys.openrouter.label',
    descriptionKey: 'settings.apiKeys.llm.keys.openrouter.description',
    url: 'https://openrouter.ai/',
    placeholder: 'your-openrouter-api-key'
  },
  {
    key: 'GIGACHAT_API_KEY',
    labelKey: 'settings.apiKeys.llm.keys.gigachat.label',
    descriptionKey: 'settings.apiKeys.llm.keys.gigachat.description',
    url: 'https://github.com/ai-forever/gigachat',
    placeholder: 'your-gigachat-api-key'
  }
];

type ResolvedApiKey = ApiKeyDefinition & {
  label: string;
  description: string;
};

export function ApiKeysSettings() {
  const { t } = useTranslation();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const financialApiKeys = useMemo<ResolvedApiKey[]>(
    () =>
      FINANCIAL_API_KEYS.map((item) => ({
        ...item,
        label: t(item.labelKey),
        description: t(item.descriptionKey),
      })),
    [t],
  );

  const llmApiKeys = useMemo<ResolvedApiKey[]>(
    () =>
      LLM_API_KEYS.map((item) => ({
        ...item,
        label: t(item.labelKey),
        description: t(item.descriptionKey),
      })),
    [t],
  );

  // Load API keys from backend on component mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiKeysSummary = await apiKeysService.getAllApiKeys();
      
      // Load actual key values for existing keys
      const keysData: Record<string, string> = {};
      for (const summary of apiKeysSummary) {
        try {
          const fullKey = await apiKeysService.getApiKey(summary.provider);
          keysData[summary.provider] = fullKey.key_value;
        } catch (err) {
          console.warn(`Failed to load key for ${summary.provider}:`, err);
        }
      }
      
      setApiKeys(keysData);
    } catch (err) {
      console.error('Failed to load API keys:', err);
      setError(t('settings.apiKeys.error.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyChange = async (key: string, value: string) => {
    // Update local state immediately for responsive UI
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));

    // Auto-save with debouncing
    try {
      if (value.trim()) {
        await apiKeysService.createOrUpdateApiKey({
          provider: key,
          key_value: value.trim(),
          is_active: true
        });
      } else {
        // If value is empty, delete the key
        try {
          await apiKeysService.deleteApiKey(key);
        } catch (err) {
          // Key might not exist, which is fine
          console.log(`Key ${key} not found for deletion, which is expected`);
        }
      }
    } catch (err) {
      console.error(`Failed to save API key ${key}:`, err);
      setError(t('settings.apiKeys.error.saveFailed', { key }));
    }
  };

  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clearKey = async (key: string) => {
    try {
      await apiKeysService.deleteApiKey(key);
      setApiKeys(prev => {
        const newKeys = { ...prev };
        delete newKeys[key];
        return newKeys;
      });
    } catch (err) {
      console.error(`Failed to delete API key ${key}:`, err);
      setError(t('settings.apiKeys.error.deleteFailed', { key }));
    }
  };

  const renderApiKeySection = (title: string, description: string, keys: ResolvedApiKey[], icon: React.ReactNode) => (
    <Card className="bg-panel border-gray-700 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-primary flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {keys.map((apiKey) => (
          <div key={apiKey.key} className="space-y-2">
                         <button
               className="text-sm font-medium text-primary hover:text-blue-500 cursor-pointer transition-colors text-left"
               onClick={() => window.open(apiKey.url, '_blank')}
             >
               {apiKey.label}
             </button>
            <div className="relative">
              <Input
                type={visibleKeys[apiKey.key] ? 'text' : 'password'}
                placeholder={apiKey.placeholder}
                value={apiKeys[apiKey.key] || ''}
                onChange={(e) => handleKeyChange(apiKey.key, e.target.value)}
                className="pr-20"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {apiKeys[apiKey.key] && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-red-500/10 hover:text-red-500"
                    onClick={() => clearKey(apiKey.key)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => toggleKeyVisibility(apiKey.key)}
                >
                  {visibleKeys[apiKey.key] ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-2">{t('settings.apiKeys.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('settings.apiKeys.loading')}
          </p>
        </div>
        <Card className="bg-panel border-gray-700 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">
              {t('settings.apiKeys.loadingHint')}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary mb-2">{t('settings.apiKeys.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('settings.apiKeys.description')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-red-500">{t('general.error')}</h4>
                <p className="text-xs text-muted-foreground">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    loadApiKeys();
                  }}
                  className="text-xs mt-2 p-0 h-auto text-red-500 hover:text-red-400"
                >
                  {t('general.retry')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Data API Keys */}
      {renderApiKeySection(
        t('settings.apiKeys.sections.financial.title'),
        t('settings.apiKeys.sections.financial.description'),
        financialApiKeys,
        <Key className="h-4 w-4" />
      )}

      {/* LLM API Keys */}
      {renderApiKeySection(
        t('settings.apiKeys.sections.llm.title'),
        t('settings.apiKeys.sections.llm.description'),
        llmApiKeys,
        <Key className="h-4 w-4" />
      )}

      {/* Security Note */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-amber-500">{t('settings.apiKeys.security.title')}</h4>
              <p className="text-xs text-muted-foreground">{t('settings.apiKeys.security.description')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
