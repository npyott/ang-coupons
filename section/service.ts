import { generateID } from "../util";
import { dynamoDB, jsObectToAttributeValue } from "../aws";

import { PREFIX, TABLE_NAME } from "./constants";
import { Section } from "./models";

export const createSection = async (options: Pick<Section, "name">) => {
    const date = new Date();

    const section: Section = {
        ...options,
        _id: generateID(PREFIX),
        createdAt: new Date(date),
        updatedAt: new Date(date),
    };

    await dynamoDB
        .putItem({
            Item: jsObectToAttributeValue(section).M,
            TableName: TABLE_NAME,
        })
        .promise();

    return section;
};
