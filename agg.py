import json
from itertools import groupby
from operator import itemgetter

import pandas as pd
from icecream import ic
from toolz import first
from typing_extensions import LiteralString

ETH: LiteralString = "Ethereum"

# load data
with open("./yields_defi_llama.json", "r") as yields_json:
    yields = json.load(yields_json)
    yields = yields["data"]
bridged_values: pd.DataFrame = pd.read_pickle("./bridged_values.pickle")

# make dataframe with yields
# NOTE: this code might be retarded
chain_groups = groupby(yields, key=itemgetter("chain"))
chain_dict = {}
for k, v in chain_groups:
    try:
        chain_dict[k] += list(v)
    except KeyError:
        chain_dict[k] = []
yields_df: pd.DataFrame = pd.concat(
    [pd.DataFrame(chain_dict[k]) for k in chain_dict.keys()]
)
yields_df["chain"] = yields_df["chain"].str.lower()
yields_df_columns = pd.MultiIndex.from_product([["DefiLlama"], yields_df.columns])

# pre-merge `bridge_values` clean up
bridge = (
    bridged_values["id"].str.split("-", expand=True, n=1).loc[:, 0].rename("bridge")
)
bridged_values = pd.concat(
    [bridged_values.loc[:, "id"], bridge, bridged_values.drop("id", axis=1)], axis=1
)
bridged_values_columns = pd.MultiIndex.from_product(
    [["CryptoAssetsApi"], bridged_values.columns]
)

# the merge
df = bridged_values.merge(yields_df, left_on="chainA", right_on="chain")
df.columns = pd.MultiIndex.from_tuples(
    list(bridged_values_columns) + list(yields_df_columns)
)
df.to_csv("./merged.csv", index=False)
