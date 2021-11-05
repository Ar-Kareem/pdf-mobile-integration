import { ActivatedRoute, Router } from "@angular/router";

export class PdfStorageModel {
  static readonly SESSION_VERSION = '0.1'; // stores the session version, in case any update to the session model, legacy models in user session is taken care of.

  public version: string;
  public sessionId: string;
  public url: string|null = null;

  constructor(sessionId: string) {
    this.version = PdfStorageModel.SESSION_VERSION;
    this.sessionId = sessionId;
  }
}

export abstract class PdfStorageUtils {
  public static getSessionIdAndSync(router: Router, route: ActivatedRoute) {
    const sessId = this.getSessionId(route);
    this.syncId(sessId, router, route);
    return sessId;
  }

  /**
   * Gets a session from the localstorage, creates new one if none exists
   * @param id the requested session id 
   * @returns the session given the id
   */
  public static getSessionFromStorage(id: string) {
    const key = 'PDFSession-' + id;
    const sessionsRaw = localStorage.getItem(key);
    let session: PdfStorageModel;
    if (!sessionsRaw) { // no session with this id, create new session.
      session = new PdfStorageModel(id);
    } else {
      session = JSON.parse(sessionsRaw);
      if (session.version !== PdfStorageModel.SESSION_VERSION) {
        console.log('Old Session Detected...');
        session = this.upgradePdfStorageModel(session);
      }
    }
    return session;
  }

  public static setSessionToStorage(session: PdfStorageModel) {
    localStorage.setItem('PDFSession-' + session.sessionId, JSON.stringify(session));
  }




  /**
   * updates both the sessionstorage and the url to be in sync on which session is currently active
   * @returns the sessions ID based on what is stored in the url params and the sessions storage 
   */
  private static getSessionId(route: ActivatedRoute) {
    const sessFromUrl = route.snapshot.queryParamMap.get('sess')
    const sessFromSessStorage = sessionStorage.getItem('sess')
    if (!!sessFromSessStorage) {
      return sessFromSessStorage;
    }
    if (!!sessFromUrl) {
      return sessFromUrl;
    }
    // both do not exist, create random
    return this.getRandomToken();
  }

  /**
   * updates both the sessionstorage and the url to be in sync on which session is currently active
   */
  private static syncId(sessID: string, router: Router, route: ActivatedRoute) {
    const sessFromUrl = route.snapshot.queryParamMap.get('sess')
    const sessFromSessStorage = sessionStorage.getItem('sess')

    if (sessID !== sessFromSessStorage) { // set session in storage
      sessionStorage.setItem('sess', sessID);
    }

    if (sessID !== sessFromUrl) { // set session in url 
      router.navigate(['.'], { relativeTo: route, queryParams: { 'sess': sessID }, queryParamsHandling: 'merge', skipLocationChange: false});
    }
  }

  private static upgradePdfStorageModel(session: PdfStorageModel) {
    switch (session.sessionId) {
      case '0.1':
        console.log('Session is at the latest version.');
        return session;
      default:
        console.error('Unknown version, will replace with new session');
        const newSession = new PdfStorageModel(session.sessionId);
        return newSession;
    }
  }

  private static getRandomToken() {
    let binary = '';
    const bytes = new Uint8Array(9);
    crypto.getRandomValues(bytes)
    for(let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    binary = btoa(binary);
    binary = binary.replace('/', '_');
    binary = binary.replace('+', '-');
    return binary;
  }

}
