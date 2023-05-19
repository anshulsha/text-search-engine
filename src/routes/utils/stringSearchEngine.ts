import posts from "../../dataset.json";

// enum for  search fields
enum SEARCH_PARAM {
  NAME = "name",
  IMAGE = "image",
  DESCRIPTION = "description",
}

// enum for sort fields
enum SORT_PARAM {
  NAME = "name",
  DATELASTEDITED = "dateLastEdited",
}

// search engine interface with search method.
interface SearchEngine<T> {
  search(
    key: string,
    pageNumber: number,
    pageSize: number,
    sortField: string
  ): PaginationResult<T>;
}

// dataset interface
interface Dataset {
  name: string;
  image: string;
  description: string;
  dateLastEdited: Date;
}

// post interface
interface Post {
  name: string;
  image: string;
  description: string;
  dateLastEdited: Date;
}

// pagination interface
interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

// DB class with data and size as member, addNewData as method
class DB<T> {
  protected data: T[] = [];
  protected size: number;
  constructor(dataset: T[]) {
    this.data = dataset;
    this.size = this.data.length;
  }

  protected addNewData(dataset: T): void {
    this.data.push(dataset);
    this.size = this.data.length;
  }
}

// Hashmap generic class extends to DB class with hashMap as HashMap, loadData, getValue, setValue as protected methods, addNew as pulic method
class HashMap<T> extends DB<T> {
  protected hashMap: { [key: string]: number[] } = {};
  constructor(dataset: T[], searchParams: SEARCH_PARAM[]) {
    super(dataset);
    this.loadData(dataset, searchParams);
  }

  private loadData<T>(dataset: T[], searchParams: SEARCH_PARAM[]): void {
    try {
      let index = 0;
      dataset.forEach((obj) => {
        searchParams.forEach((eachParam) => {
          let sanitizedString = obj[eachParam].replace(/\s+/g, " ").trim();
          const text: string[] = sanitizedString.split(" ");
          text.forEach((t) => {
            t = t.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "");
            this.setValue(t, index);
          });
        });
        index++;
      });
    } catch (error) {}
  }
  protected getValue(key: string): number[] {
    try {
      return this.hashMap[key];
    } catch (error) {
      // Handle Errors
    }
  }
  protected setValue(key: string, id: number): void {
    try {
      key = key.toLowerCase();

      this.hashMap[key] ??= [];
      if (this.hashMap[key][this.hashMap[key].length - 1] !== id) {
        this.hashMap[key].push(id);
      }
    } catch (error) {
      // Handle Errors
    }
  }
  addNew(dataset: T[], searchParams: SEARCH_PARAM[]): void {
    try {
      let index = this.size;
      dataset.forEach((obj) => {
        searchParams.forEach((eachParam) => {
          let sanitizedString = obj[eachParam].replace(/\s+/g, " ").trim();
          const text: string[] = sanitizedString.split(" ");
          text.forEach((t) => {
            t = t.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "");
            this.setValue(t, index);
          });
        });
        this.addNewData(dataset[0]);
        index++;
      });
    } catch (error) {}
  }
}

// StringSearchEngine class extends to HashMap and implements SearchEngine interface handle search functionality
class StringSearchEngine
  extends HashMap<Dataset>
  implements SearchEngine<Dataset>
{
  constructor(dataset: Dataset[], search_param: SEARCH_PARAM[]) {
    super(dataset, search_param);
  }
  search(
    key: string,
    pageNumber: number,
    pageSze: number,
    sortField: string
  ): PaginationResult<Dataset> {
    try {
      let sanitized_string = key.replace(/\s+/g, " ").trim();
      sanitized_string = sanitized_string.replace(
        /[&\/\\#,+()$~%.'":*?<>{}]/g,
        ""
      );
      let text: string[] = sanitized_string.split(" ");
      let result: number[] = [];
      const isExactMatch: boolean = key.startsWith("'") && key.endsWith("'");
      let count = 0;
      for (let t of text as string[]) {
        t = t.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "");
        t = t.toLowerCase().trim();

        if (count == 0 && this.getValue(t) != undefined) {
          result = this.getValue(t);
          count++;
        }
        result = this.intersection(result, this.getValue(t));
      }
      if (isExactMatch)
        result = this.exactSearch(key.toLowerCase().trim(), result);

      let post: Dataset[] = result.map((item) => {
        return this.data[item];
      });
      if (sanitized_string == "") {
        post = this.data;
      }
      const duplicate_post = JSON.parse(JSON.stringify(post));

      const sortedDataset = this.sort(
        duplicate_post,
        pageNumber,
        pageSze,
        sortField
      );
      return sortedDataset;
    } catch (error) {}
  }

  private exactSearch(key: string, arr: number[]): number[] {
    try {
      const result: number[] = [];
      key = key.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
      key = key.toLowerCase().trim();

      for (const item of arr || []) {
        for (const param of Object.values(SEARCH_PARAM)) {
          const text = this.data[item][param];
          if (text.toLowerCase().includes(key)) {
            result.push(item);
          }
        }
      }
      return result;
    } catch (err) {
      // Handle Errors
    }
  }

  private intersection(arr1: number[], arr2: number[]): number[] {
    try {
      let i = 0;
      let j = 0;
      let intersectionArray: number[] = [];

      while (i < arr1.length && j < arr2.length) {
        if (i > 0 && arr1[i] === arr1[i - 1]) {
          i++;
          continue;
        }

        if (arr1[i] < arr2[j]) {
          i++;
        } else if (arr2[j] < arr1[i]) {
          j++;
        } else {
          intersectionArray.push(arr2[j]);
          i++;
          j++;
        }
      }

      return intersectionArray;
    } catch (error) {
      // Handle Errors
    }
  }
  private sort(
    filteredPosts: Dataset[],
    pageNumber: number,
    pageSize: number,
    sortField: string
  ): PaginationResult<Dataset> {
    try {
      const sortedPosts = filteredPosts.sort((a, b) => {
        switch (sortField) {
          case SORT_PARAM.NAME:
            return a.name.localeCompare(b.name);
            break;
          case SORT_PARAM.DATELASTEDITED:
            return (
              new Date(b.dateLastEdited).getTime() -
              new Date(a.dateLastEdited).getTime()
            );
            break;
          default:
            return 0;
        }
      });

      const paginatedPosts: PaginationResult<Dataset> = this.paginateArray(
        sortedPosts,
        pageSize,
        pageNumber
      );
      return paginatedPosts;
    } catch (error) {
      // Handle Errors
    }
  }

  private paginateArray<T>(
    array: T[],
    pageSize: number,
    currentPage: number
  ): PaginationResult<T> {
    const totalItems = array.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const totalPosts = totalItems;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedData = array.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      currentPage,
      totalPages,
      totalPosts,
    };
  }
}

// method to parse imported data into TS object.
function parseJson() {
  const arr: Post[] = [];
  posts.map((item) => {
    let data: Post = {
      name: item.name,
      image: item.image,
      description: item.description,
      dateLastEdited: new Date(item.dateLastEdited),
    };
    arr.push(data);
  });
  return arr;
}

export {
  StringSearchEngine,
  SEARCH_PARAM,
  PaginationResult,
  Post,
  Dataset,
  parseJson,
};
