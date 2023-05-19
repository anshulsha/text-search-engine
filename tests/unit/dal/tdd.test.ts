import {
  StringSearchEngine,
  SEARCH_PARAM,
  parseJson,
  PaginationResult,
  Post,
  Dataset,
} from "../../../src/routes/utils/stringSearchEngine";

// Create a test suite for the StringSearchEngine class
describe("StringSearchEngine", () => {
  let searchEngine: StringSearchEngine;
  let dataset: Dataset[];
  let searchParams: SEARCH_PARAM[];

  // Initialize the test data and search engine instance before each test
  beforeEach(() => {
    dataset = parseJson();
    searchParams = [SEARCH_PARAM.NAME, SEARCH_PARAM.DESCRIPTION];
    searchEngine = new StringSearchEngine(dataset, searchParams);
  });

  // Test the search method
  describe("search", () => {
    it("should return correct search results for a given key", () => {
      const key = "the ring";
      const pageNumber = 1;
      const pageSize = 10;
      const sortField = "name";

      const result = searchEngine.search(key, pageNumber, pageSize, sortField);

      expect(result.data.length).toBe(1);

      const [firstResult] = result.data;

      expect(firstResult.name).toBe("Customer Assurance Liaison");
    });
  });

  describe("search", () => {
    it("should return correct search results with having exact same match of the given key", () => {
      const key = "'the ring'";
      const match_string = "the ring";
      const pageNumber = 1;
      const pageSize = 10;
      const sortField = "name";

      const result = searchEngine.search(key, pageNumber, pageSize, sortField);
      expect(result.data.length).toBe(1);

      const [firstResult] = result.data;
      const flag: boolean =
        firstResult.description.toLowerCase().includes(match_string) ||
        firstResult.name.toLowerCase().includes(match_string);
      expect(flag).toBe(true);
    });
  });

  describe("sort by date", () => {
    it("should return correct sorted search in descending order of date field", () => {
      const key = "";
      const pageNumber = 1;
      const pageSize = 10;
      const sortField = "dateLastEdited";

      const result = searchEngine.search(key, pageNumber, pageSize, sortField);

      const [firstResult] = result.data;
      expect(firstResult.name).toContain("Test Data for dateLastEdited filter");
    });
  });

  describe("sort by name", () => {
    it("should return correct sorted search in ascending order of name field", () => {
      const key = "";
      const pageNumber = 1;
      const pageSize = 10;
      const sortField = "name";

      const result = searchEngine.search(key, pageNumber, pageSize, sortField);

      const [firstResult] = result.data;
      expect(firstResult.name).toContain("Aaaple vinegar");
    });
  });
});
