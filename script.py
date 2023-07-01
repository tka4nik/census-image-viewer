import json

import requests

if __name__ == '__main__':
    response = requests.get(
        "https://census.lithafalcon.cc/get/ps2/image?c:start={start}&c:limit=100&c:join=item^on:path"
        "^to:image_path^show:name%27description^list:1&c:tree=path".format(start=0)).json()["image_list"]
    print(response)
    return_data = {}

    for i in response:
        for image in i:
            data = {}
            data["dev_description"] = i[image]["description"]
            data["description"] = ""
            if i[image]["path_join_item"] and i[image]["path_join_item"][0]:
                for description in i[image]["path_join_item"][:3:]:
                    if "name" in description:
                        data["description"] += description["name"]['en'] + ", "
            return_data[i[image]["image_id"]] = data
    print(return_data)

    with open('data.json', 'w') as f:
        json.dump(return_data, f)