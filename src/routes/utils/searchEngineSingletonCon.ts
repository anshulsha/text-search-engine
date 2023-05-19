import {
  StringSearchEngine,
  SEARCH_PARAM,
  parseJson,
} from "./stringSearchEngine";

class Init {
  static singleton_connection: StringSearchEngine | undefined = undefined;
  static getConnection(): StringSearchEngine {
    try {
      if (this.singleton_connection === undefined) {
        console.log(
          "---------------------------- new connection ----------------------------"
        );
        this.singleton_connection = new StringSearchEngine(parseJson(), [
          SEARCH_PARAM.NAME,
          SEARCH_PARAM.DESCRIPTION,
          // SEARCH_PARAM.IMAGE,
        ]);
      }
      return this.singleton_connection;
    } catch (error) {
      // Handle Errors
    }
  }
}

const connection = Init.getConnection();

export default connection;
