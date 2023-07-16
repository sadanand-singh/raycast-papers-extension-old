import { render } from "@raycast/api";
import { searchResources } from "./common/readcubeApi";
import { initialize } from "./common/initialize";
import { useStore } from "./common/store";
import { View } from "./common/View";

const MyView = ({ cookie, library_id }: { cookie: string, library_id:string  }) => {
  const store = useStore(["results"], (_, q) => searchResources(cookie, library_id, q as string));
  const sectionNames = ["Search Results"];
  return (
    <View
      sectionNames={sectionNames}
      queryResults={store.queryResults}
      isLoading={store.queryIsLoading}
      onSearchTextChange={(text) => {
        if (text) {
          store.runQuery(text);
        } else {
          store.clearResults();
        }
      }}
      throttle
    />
  );
};

async function main() {
  const { cookie, library_id } = await initialize();
  render(<MyView cookie={cookie} library_id={library_id}/>);
}

main();
