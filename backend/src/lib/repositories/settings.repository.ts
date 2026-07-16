import { PlatformSettings, getPlatformSettings, updatePlatformSettings } from "../db";

export class SettingsRepository {
  async get(): Promise<PlatformSettings> {
    return await getPlatformSettings();
  }

  async update(updates: Partial<PlatformSettings>): Promise<PlatformSettings> {
    return await updatePlatformSettings(updates);
  }
}
