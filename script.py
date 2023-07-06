import json

import requests

if __name__ == '__main__':
    response_data = []

    i = 0
    while True:
        response = requests.get(
            "https://census.lithafalcon.cc/get/ps2/image?c:start={start}&c:limit=100&c:join=item^on:path"
            "^to:image_path^show:name%27description^list:1&c:tree=path".format(start=i * 100))

        if not response.ok:
            break
        if not response_data:
            response_data = response.json()['image_list']
        if not response.json()['image_list']:
            break
        else:
            response_data += response.json()['image_list']
        print(len(response_data))
        # print(response.content)
        print(response)

        i += 1

    print(response_data)
    print(len(response_data))
    return_data = {}

    for i in response_data:
        for image in i:
            print(image)
            if not "description" in i[image]:
                continue
            data = {"dev_description": i[image]["description"], "description": ""}
            if i[image]["path_join_item"] and i[image]["path_join_item"][0]:
                for description in i[image]["path_join_item"][:3:]:
                    if "name" in description and "en" in description["name"]:
                        data["description"] += description["name"]['en'] + ", "
            return_data[i[image]["image_id"]] = data
    print(return_data)

    with open('data.json', 'w') as f:
        json.dump(return_data, f)
