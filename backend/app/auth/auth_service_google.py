import os
import logging
import json
import requests
from oauthlib.oauth2 import WebApplicationClient
from flask import request, redirect
from urllib import request as urllib_request


logger = logging.getLogger(__name__)

class __GoogleKeyStore:
    def __init__(self) -> None:
        self.GOOGLE_AUTH_KEYS_AVAILABLE = False

        self.GOOGLE_DISCOVERY_URL='https://accounts.google.com/.well-known/openid-configuration'
        self.GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', default=None)

        # below is ultra secret
        self.GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', default=None)

        # determine if all keys loaded correctly
        self.GOOGLE_AUTH_KEYS_AVAILABLE = \
            self.GOOGLE_CLIENT_ID is not None and \
            self.GOOGLE_CLIENT_SECRET is not None

    def available(self) -> bool:
        return self.GOOGLE_AUTH_KEYS_AVAILABLE

__googleKeyStore = __GoogleKeyStore()


CLOSE_WINDOW_SCRIPT = '<script>window.onload = window.close();</script>'
# OAuth 2 client setup
client = WebApplicationClient(__googleKeyStore.GOOGLE_CLIENT_ID)

def _google_auth_is_available():
    status = __googleKeyStore.available()
    if not status:
        logger.error("Google OAuth not available")
    return status

def _get_google_provider_cfg():
    return requests.get(__googleKeyStore.GOOGLE_DISCOVERY_URL).json()

def google_login(redirect_uri):
    if not _google_auth_is_available():
        return CLOSE_WINDOW_SCRIPT

    # Find out what URL to hit for Google login
    google_provider_cfg = _get_google_provider_cfg()
    # below should be 'https://accounts.google.com/o/oauth2/v2/auth'
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=redirect_uri,
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

def google_after_login_redirect(user_code):
    if not _google_auth_is_available():
        return CLOSE_WINDOW_SCRIPT

    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = _get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    base_url = request.base_url
    if 'http://' in base_url:  # oauth MUST use https, convert
        base_url = base_url.replace('http://', 'https://')
    url = request.url
    if 'http://' in url:  # oauth MUST use https, convert
        url = url.replace('http://', 'https://')
    
    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=url,
        redirect_url=base_url,
        code=user_code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(__googleKeyStore.GOOGLE_CLIENT_ID, __googleKeyStore.GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens!
    client.parse_request_body_response(json.dumps(token_response.json()))

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)


    if userinfo_response.json().get("email_verified"):
        return f"""
        <html>
            {CLOSE_WINDOW_SCRIPT}
            <body>
                <h1>You may close this tab now!</h1>
                <div>{str(userinfo_response.json())}</div>
            </body>
        </html>
        """
    else:
        return "User email not available or not verified by Google.", 400

def update_google_dynamic_dns_to_current_ip():
    """Updates the dynamic dns (basically the url) to point to the current public ip of this device.
    Useful to call this function periodiclly such that whenever ISP updates my ip this function will tell google the new IP
    """
    periodic = bool(os.environ.get('GOOGLE_DNS_PERIODIC_UPDATE', default='False'))
    hostname = os.environ.get('GOOGLE_DNS_HOSTNAME', default=None)
    username = os.environ.get('GOOGLE_DNS_USERNAME', default=None)
    password = os.environ.get('GOOGLE_DNS_PASSWORD', default=None)
    print(periodic)

    if hostname is None or username is None or password is None:
        logger.error('Cannot update google dns. Missing essential environment variables')
        return

    # GET MY IP
    with urllib_request.urlopen('https://ipecho.net/plain') as response:
        html = response.read(amt=1024 * 1024)
        myip = str(html, 'utf-8')

    googleapi = f'https://domains.google.com/nic/update?hostname={hostname}&myip={myip}'
    password_mgr = urllib_request.HTTPPasswordMgrWithDefaultRealm()
    password_mgr.add_password(None, googleapi, username, password)
    handler = urllib_request.HTTPBasicAuthHandler(password_mgr)
    opener = urllib_request.build_opener(handler)
    u = opener.open(googleapi)
    html = u.read()
    response = str(html, 'utf-8')

    logger.info('Google DNS update response:' + response)

