
import { faker } from "@faker-js/faker";
export default (user,count,applicationIDIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
applicationID: applicationIDIds[i % applicationIDIds.length],
applicationStatus: "Rejected",
applicationSentDate: faker.date.past(""),
institutionStatus: "Pending",
institutionRespondedDate: faker.date.past(""),
applicationNotiStatus: "Pending",
applicationNotiSentDate: faker.date.past(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
