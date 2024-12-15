import { createItem, deleteItems } from "@directus/sdk";

// This function can be used to create example data for your extension
export default async function examples() {
  const directus = await useDirectusAdmin();
  await directus.request(deleteItems("com_unit", { limit: 1000 }));
  await directus.request(deleteItems("com_crop", { limit: 1000 }));
  await directus.request(deleteItems("com_harvest_item", { limit: 1000 }));
  await directus.request(deleteItems("com_harvest", { limit: 1000 }));
  console.info("deleted all items");
  //let pieceID = null;
  //let kgID = null;

  let units = [
    { name: "kg", id: null },
    { name: "Stück", id: null },
  ];

  await Promise.all(
    units.map(async (unit) => {
      try {
        await directus
          .request(
            createItem("com_unit", {
              name_of_unit: unit.name,
            })
          )
          .then((response) => {
            console.info("Created unit: ", response);
            unit.id = response.id;
          });
      } catch (error) {
        console.info(error);
      }
    })
  );

  /* generate some crops */

  let crops = [
    {
      name: "Tomaten",
      id: null,
      default_unit: units[0].id,
    },
    {
      name: "Gurken",
      id: null,
      default_unit: units[1].id,
    },
    {
      name: "Zwiebeln",
      id: null,
      default_unit: null,
    },
  ];

  let responseCrops = [];

  await Promise.all(
    crops.map(async (crop) => {
      try {
        await directus
          .request(
            createItem("com_crop", {
              name_of_crop: crop.name,
              default_unit: crop.default_unit,
            })
          )
          .then((response) => {
            console.info("Created crop: ", response);
            responseCrops.push(response);
          });
      } catch (error) {
        console.info(error);
      }
    })
  );

  let harvestID = null;

  await directus
    .request(
      createItem("com_harvest", {
        name_of_harvest: "KW 42",
      })
    )
    .then((response) => {
      console.info("Created harvest: ", response);
      harvestID = response.id;
    });

  console.info("responseCrops: ", responseCrops);

  await Promise.all(
    responseCrops.map(async (crop) => {
      try {
        await directus
          .request(
            createItem("com_harvest_item", {
              harvested_crop: crop.id,
              items_unit: crop.default_unit,
              harvested_amount: 100,
              of_harvest: harvestID,
            })
          )
          .then((response) => {
            console.info("Created harvest item: ", response);
          });
      } catch (error) {
        console.info(error);
      }
    })
  );
}
