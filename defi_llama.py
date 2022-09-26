from icecream import ic

import json
import pandas as pd

with open("./yields_defi_llama.json", 'r') as file:
    yields = json.load(file)

yields_data = yields['data']
pd.DataFrame(yields_data).to_pickle("./yields.defi_llama.pickle")
