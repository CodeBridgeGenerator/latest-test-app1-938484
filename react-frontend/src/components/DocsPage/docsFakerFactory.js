
import { faker } from "@faker-js/faker";
export default (user,count,applicationIDIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
applicationID: applicationIDIds[i % applicationIDIds.length],
docName: faker.lorem.sentence(""),
docFileName: faker.lorem.sentence(""),
docURL: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
