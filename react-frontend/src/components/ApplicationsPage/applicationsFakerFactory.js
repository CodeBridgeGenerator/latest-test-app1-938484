
import { faker } from "@faker-js/faker";
export default (user,count,membersIds,applicationTypeIDIds,refInstitutionIDIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
name: faker.lorem.sentence(""),
members: membersIds[i % membersIds.length],
applicationTypeID: applicationTypeIDIds[i % applicationTypeIDIds.length],
refInstitutionID: refInstitutionIDIds[i % refInstitutionIDIds.length],
bioData: faker.lorem.sentence(""),
education: faker.lorem.sentence(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
