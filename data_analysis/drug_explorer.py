import requests
import yaml
import os

def paginator(func, limit=None, rate_limit=100, **kwargs):
     # there'll only be one return necessary if we're at the limit already
    init_limit = limit if limit is not None and limit < rate_limit else rate_limit
    skip = 0
    _, total, results = func(limit=init_limit, skip=skip, **kwargs)

    skip += init_limit
    
    if results is None:
        return None
    
    for row in results:
        yield row
    
    while (limit is not None and limit > skip + rate_limit) and total > (skip + rate_limit):
        _, total, results = func(limit=rate_limit, skip=skip, **kwargs)
        skip += rate_limit

        for row in results:
            yield row

class DrugEvent(object):
    def __init__(self, api_key=None, rate_limit=100):
        super().__init__()

        self.base_url = "https://api.fda.gov/drug/event.json?"
        self.fields_location = "./fields.yaml"
        self.api_key = api_key
        self.rate_limit = rate_limit
        self.fields_cache = None
    
    @property
    def url_key(self):
        if self.api_key is None:
            return self.base_url + "&"
        else:
            return self.base_url + "api_key={api_key}&".format(api_key=self.api_key)

    def __get_raw_data(self, limit, skip):
        url = self.url_key + "limit={limit}&skip={skip}".format(limit=limit, skip=skip)

        r = requests.get(url)
        json_data = r.json()
        
        if "meta" in json_data:
            data_info = json_data["meta"]["results"]
        else:
            print(json_data)
            return (skip, None, None)


        results = json_data["results"]

        skip = data_info["skip"]
        total = data_info["total"]

        return skip, total, results
    
    def get_field_count(self, field, field_value=None, api_key=None):
        
        if field_value is None:
            field_counts_url = "count={field}".format(field=field)
        else:
            field_value_in = field_value.replace(" ", "+")
            field_counts_url = "search={field}:{field_value}&count={field}".format(field=field, field_value=field_value_in)

        url = self.url_key + field_counts_url

        r = requests.get(url)
        json_data = r.json()

        results = json_data["results"]
        
        row_count = None
        
        # should be the first item, but just in case, iterate anyways
        for row in results:
            if row["term"] == field_value:
                row_count = row["count"]
                return row_count
        
        return row_count

    def get_raw_data(self, limit=None):
        return paginator(self.__get_raw_data, rate_limit=self.rate_limit, limit=limit)

    @property
    def fields(self):
        if self.fields_cache is None:
            return self.get_fields()
        
        return self.fields_cache

    def get_fields(self):

        with open(self.fields_location, 'r', encoding="utf8") as stream:
            try:
                fields = yaml.safe_load(stream)
            except yaml.YAMLError as exc:
                print(exc)

        if fields is None:
            print("couldn't access the settings file!")
            exit(0)
        
        self.fields_cache = fields

        return fields

    def __run_query(self, query, limit, skip):
        url = self.url_key + query + "&limit={limit}&skip={skip}".format(limit=limit, skip=skip)

        r = requests.get(url)
        json_data = r.json()
        
        if "meta" in json_data:
            data_info = json_data["meta"]["results"]
        else:
            print(json_data)
            return (skip, None, None)

        results = json_data["results"]

        if results is None:
            return (skip, None, None)


        skip = data_info["skip"]
        total = data_info["total"]

        return skip, total, results

    def get_query_total(self, query):
        return self.__run_query(query=query, limit=1, skip=0)[1]
    
    def get_query(self, query, limit=None):
        return paginator(self.__run_query, rate_limit=self.rate_limit, limit=limit, query=query)

    def run_query(self, query):
        url = self.url_key + query

        r = requests.get(url)
        json_data = r.json()

        return json_data["results"]