import mixpanel from 'mixpanel-browser';
import { User } from 'types';
import { WebEvent } from './WebEvent';

// todo: improve error handling
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '';

class EventTracker {
  private initialized = false;

  public init() {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: true,
      track_pageview: true,
      persistence: 'localStorage',
    });
    this.initialized = true;
  }

  public track(event: WebEvent, params?: Record<string, unknown>) {
    if (!this.initialized) return;

    const eventParams = {
      distinct_id: mixpanel.get_distinct_id() ?? null,
      timestamp: new Date().toISOString(),
      page_url: typeof window !== 'undefined' ? window.location.href : null,
      ...params,
    };

    mixpanel.track(event, eventParams);
  }

  public identify(ra: number) {
    if (!this.initialized) return;
    mixpanel.identify(String(ra)); // todo: maybe use userId instead of ra
  }

  public setUserProperties(userData: User) {
    if (!this.initialized) return;

    const { _id: userId, oauth, email, createdAt, ra } = userData;

    const userProperties = {
      $id: userId,
      $email: email,
      $createdAt: createdAt,
      $oauth: oauth,
      $userId: userId,
      $ra: ra,
    };

    mixpanel.people.set(userProperties);
  }

  public reset() {
    mixpanel.reset();
    this.initialized = false;
  }
}

export const eventTracker = new EventTracker();
