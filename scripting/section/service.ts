import { Section } from "ang-coupons-2023/sections";

import { generateID } from "../util";
import { dynamoDB, jsObectToAttributeValue } from "../aws";

import { PREFIX, TABLE_NAME } from "./constants";

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
