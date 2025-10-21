import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES, useTranslation } from '@/contexts/language-context';

const LANGUAGE_ORDER: typeof SUPPORTED_LANGUAGES = ['EN', 'CN', 'JA', 'KO', 'AR', 'FR', 'DE'];

export function LanguageSettings() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary mb-2">{t('settings.language.header')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('settings.language.subtitle')}
        </p>
      </div>

      <Card className="bg-panel border-gray-700 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-primary">
            {t('settings.language.card.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('settings.language.card.help')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LANGUAGE_ORDER.map((code) => {
              const key = code.toLowerCase();
              return (
                <Button
                  key={code}
                  variant="outline"
                  className={cn(
                    'flex flex-col items-start gap-2 h-auto p-4 bg-panel border-gray-600 hover:border-primary hover-bg',
                    language === code && 'border-blue-500 bg-blue-500/10 text-blue-500',
                  )}
                  onClick={() => setLanguage(code)}
                >
                  <div className="font-medium text-sm">{t(`settings.language.option.${key}`)}</div>
                  <div className="text-xs text-muted-foreground">
                    {t(`settings.language.option.${key}.desc`)}
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
