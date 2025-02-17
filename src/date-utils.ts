import { GraphQLError } from "graphql/error/GraphQLError";

// Takes a string and returns a Date object or null.
export function convertStringToDate(dateString: string | undefined) {
  let convertedDate = null;
  if (dateString) {
    convertedDate = new Date(dateString);
    if (isNaN(convertedDate.valueOf())) {
      throw new GraphQLError(
        `Due date string '${dateString}' is not in a valid format.` +
          ` Please try using either YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ.`
      );
    }
  }
  return convertedDate;
}

// Takes a boolean (or undefined) and returns the appropriate filter.
export function getOverdueFilter(isOverdue: boolean | undefined) {
  if (isOverdue !== undefined) {
    if (isOverdue) {
      return {
        lte: new Date(),
      };
    } else {
      return {
        gt: new Date(),
      };
    }
  }

  // If isOverdue is undefined, doesn't change anything.
  return undefined;
}
