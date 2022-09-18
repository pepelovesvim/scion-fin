import pandas as pd

# df = pd.read_json("./bridges.json").iloc[:, 1]
# rows = []
# for _, x in df.items():
#     id, chains, bundle = (x["id"], x["metadata"]["metadata"], x["bundle"])
#     rows.append((bundle, chains["chainA"], chains["chainB"], id))
# column_names = ["bundle", "chain_A", "chain_B", "id"]

# bridges_df = pd.DataFrame(rows, columns=column_names).sort_values(by="bundle")
# print(bridges_df)
# bridges_df.to_csv("./bridges.csv")

df = pd.read_json("./bridged_values.json")
print(df)
df.to_csv("./bridged_values.csv")
