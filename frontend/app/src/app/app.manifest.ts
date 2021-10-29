const DEFAULT_MANIFEST = {
    "name": "pdf-integration",
    "short_name": "pdf-integration",
    "theme_color": "#a70000",
    "background_color": "#a70000",
    "display": "standalone",
    "orientation": "any",
    "lang": "en",
    "dir": "rtl",
    "start_url": window.location.origin,
    "gcm_sender_id": "482941778795",
    "DO_NOT_CHANGE_GCM_SENDER_ID": "Do not change the GCM Sender ID"
}


export function getDefaultApplicationManifest() {
    return {...DEFAULT_MANIFEST}
}

export function setGlobalApplicationManifest(manifestJSON: {[prop: string]: string}) {
    const stringManifest = JSON.stringify(manifestJSON);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    document.querySelector('#my-manifest-placeholder')?.setAttribute('href', manifestURL);
}