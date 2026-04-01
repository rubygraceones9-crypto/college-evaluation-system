'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, CheckCircle, Database, Bell, Lock, HardDrive } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState('');
  const [selectedTab, setSelectedTab] = useState<'general' | 'evaluation' | 'notification' | 'maintenance' | 'security'>('general');
  const [settings, setSettings] = useState({
    institutionName: 'College of Information Technology',
    institutionCode: 'CIT',
    academicCalendar: 'semester',
    allowAnonymous: true,
    requireComments: true,
    showCHEDIndicator: true,
    enableAIAnalysis: false,
    evaluationScale: '5',
    sendDeadlineReminders: true,
    notifySubmission: true,
    sendCompletionReports: false,
    alertLowCompletion: true,
    twoFactorAuth: false,
    dataEncryption: true,
  });

  const showSaved = (message: string) => {
    setSaved(message);
    setTimeout(() => setSaved(''), 3000);
  };

  const handleSaveGeneral = () => {
    showSaved('✓ General settings saved successfully!');
  };

  const handleSaveEvaluation = () => {
    showSaved('✓ Evaluation settings saved successfully!');
  };

  const handleSaveNotification = () => {
    showSaved('✓ Notification settings saved successfully!');
  };

  const handleSaveSecurity = () => {
    showSaved('✓ Security settings saved successfully!');
  };

  const handleBackupData = () => {
    showSaved('✓ Data backup initiated. This may take a few minutes.');
  };

  const handleClearCache = () => {
    showSaved('✓ System cache cleared successfully!');
  };

  const handleArchiveEvals = () => {
    if (confirm('This will archive evaluations older than 2 years. This action cannot be undone. Continue?')) {
      showSaved('✓ Archival process started');
    }
  };

  const handleDatabaseOptimize = () => {
    showSaved('✓ Database optimization started');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure system-wide evaluation settings and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'general' as const, label: 'General', icon: '⚙️' },
          { id: 'evaluation' as const, label: 'Evaluation', icon: '📋' },
          { id: 'notification' as const, label: 'Notifications', icon: '🔔' },
          { id: 'security' as const, label: 'Security', icon: '🔒' },
          { id: 'maintenance' as const, label: 'Maintenance', icon: '🔧' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition ${
              selectedTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {saved}
        </div>
      )}

      {/* General Settings Tab */}
      {selectedTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic institution and system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Institution Name"
              value={settings.institutionName}
              onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
            />
            <Input
              label="Institution Code"
              value={settings.institutionCode}
              onChange={(e) => setSettings({ ...settings, institutionCode: e.target.value })}
            />
            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Academic Calendar Type
              </div>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={settings.academicCalendar}
                onChange={(e) => setSettings({ ...settings, academicCalendar: e.target.value })}
              >
                <option value="semester">Semester (2 periods/year)</option>
                <option value="trimester">Trimester (3 periods/year)</option>
              </select>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg flex gap-2 text-sm text-blue-900 dark:text-blue-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Changes to institution details will be reflected across all reports and documents.</p>
            </div>
            <Button variant="primary" onClick={handleSaveGeneral}>Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Settings Tab */}
      {selectedTab === 'evaluation' && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Settings</CardTitle>
            <CardDescription>Configure evaluation form and scoring options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Checkbox
                label="Allow anonymous evaluations"
                checked={settings.allowAnonymous}
                onChange={(e) => setSettings({ ...settings, allowAnonymous: e.target.checked })}
              />
              <Checkbox
                label="Require evaluation comments"
                checked={settings.requireComments}
                onChange={(e) => setSettings({ ...settings, requireComments: e.target.checked })}
              />
              <Checkbox
                label="Show CHED compliance indicator"
                checked={settings.showCHEDIndicator}
                onChange={(e) => setSettings({ ...settings, showCHEDIndicator: e.target.checked })}
              />
              <Checkbox
                label="Enable AI feedback analysis"
                checked={settings.enableAIAnalysis}
                onChange={(e) => setSettings({ ...settings, enableAIAnalysis: e.target.checked })}
              />
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Evaluation Scale
              </div>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={settings.evaluationScale}
                onChange={(e) => setSettings({ ...settings, evaluationScale: e.target.value })}
              >
                <option value="4">4-point scale (1-4)</option>
                <option value="5">5-point scale (1-5)</option>
                <option value="10">10-point scale (1-10)</option>
              </select>
            </div>

            <Button variant="primary" onClick={handleSaveEvaluation}>Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings Tab */}
      {selectedTab === 'notification' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure when administrators receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Checkbox
                label="Send deadline reminders"
                checked={settings.sendDeadlineReminders}
                onChange={(e) => setSettings({ ...settings, sendDeadlineReminders: e.target.checked })}
              />
              <Checkbox
                label="Notify on evaluation submission"
                checked={settings.notifySubmission}
                onChange={(e) => setSettings({ ...settings, notifySubmission: e.target.checked })}
              />
              <Checkbox
                label="Send completion reports"
                checked={settings.sendCompletionReports}
                onChange={(e) => setSettings({ ...settings, sendCompletionReports: e.target.checked })}
              />
              <Checkbox
                label="Alert on low completion rate (below 50%)"
                checked={settings.alertLowCompletion}
                onChange={(e) => setSettings({ ...settings, alertLowCompletion: e.target.checked })}
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-900 dark:text-blue-200">
              <p><strong>Note:</strong> Notifications are sent to the administrator email address registered in the system.</p>
            </div>

            <Button variant="primary" onClick={handleSaveNotification}>Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {/* Security Settings Tab */}
      {selectedTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security and data protection options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Checkbox
                label="Enable two-factor authentication"
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
              />
              <Checkbox
                label="Enable data encryption at rest"
                checked={settings.dataEncryption}
                onChange={(e) => setSettings({ ...settings, dataEncryption: e.target.checked })}
              />
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm text-yellow-900 dark:text-yellow-200 flex gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p><strong>Important:</strong> Security features are enabled and recommended for production environments.</p>
            </div>

            <Button variant="primary" onClick={handleSaveSecurity}>Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Settings Tab */}
      {selectedTab === 'maintenance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Backup and archive evaluation data
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={handleBackupData} className="gap-2">
                  <HardDrive className="w-4 h-4" />
                  Backup Data
                </Button>
                <Button variant="danger" onClick={handleArchiveEvals}>
                  Archive Old Evaluations
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optimize system performance and cache
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={handleClearCache}>
                  Clear Cache
                </Button>
                <Button variant="outline" onClick={handleDatabaseOptimize}>
                  Optimize Database
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-900 dark:text-red-200">Danger Zone</CardTitle>
              <CardDescription className="text-red-800 dark:text-red-300">
                Irreversible actions that may affect your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                These actions cannot be undone. Please proceed with caution.
              </p>
              <Button variant="danger" disabled>
                Reset System (disabled in demo)
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
