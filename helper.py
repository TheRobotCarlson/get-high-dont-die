import requests

import yaml

import os



def get_credentials():
    credential_location = os.environ['credentials'] + "/openfda.yaml"
    program_settings = None

    with open(credential_location, 'r') as stream:
        try:
            program_settings = yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)

    if program_settings is None:
        print("couldn't access the settings file!")
        exit(0)
    
    return program_settings



def main():
    # With an API key: 240 requests per minute, per key. 120000 requests per day, per key.
    api_key = get_credentials()["apiKey"]
    print(api_key)



if __name__ == "__main__":
    main()