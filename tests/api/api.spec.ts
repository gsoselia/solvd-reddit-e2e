
import { test, expect } from "@playwright/test";

type DogApiResponse<T> = {
    data:T[];
}

type DogBreed = {
    id: string;
    type: string;
    attributes: {
        name: string;
        description: string;
        hypoallergenic: boolean;
        life: {
            min: number;
            max: number;
        };
        male_weight: {
            min: number;
            max: number;
        };
        female_weight: {
            min: number;
            max: number;
        };
    };
}

const expectPropertyOfType = (property: any, type: string) => {
    expect(property).toBeDefined();
    expect(typeof property).toBe(type);
}

test("Can fetch dog breed information", async ({
  page,
}) => {
    const response = await fetch('https://dogapi.dog/api/v2/breeds?page[number]=1&page[size]=10');
    expect(response.ok).toBeTruthy();

    const { data } = await response.json() as DogApiResponse<DogBreed>;
    
    expect(data).not.toHaveLength(0);
   
    const firstDog = data[0];

    // in some cases api might not have 10 records
    expect.soft(data).toHaveLength(10);

    expectPropertyOfType(firstDog.attributes.name, 'string');
    expectPropertyOfType(firstDog.attributes.description, 'string');
    expectPropertyOfType(firstDog.attributes.hypoallergenic, 'boolean');

    expectPropertyOfType(firstDog.attributes.life, 'object');
    expectPropertyOfType(firstDog.attributes.life.min, 'number');
    expectPropertyOfType(firstDog.attributes.life.max, 'number');

    expectPropertyOfType(firstDog.attributes.male_weight, 'object');
    expectPropertyOfType(firstDog.attributes.male_weight.min, 'number');
    expectPropertyOfType(firstDog.attributes.male_weight.max, 'number');
    expectPropertyOfType(firstDog.attributes.female_weight, 'object');
    expectPropertyOfType(firstDog.attributes.female_weight.min, 'number');
    expectPropertyOfType(firstDog.attributes.female_weight.max, 'number');
});
