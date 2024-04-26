import { createItem, createItems, deleteItems } from "@directus/sdk";

// This function can be used to create example data for your extension
export default async function examples() {
  const directus = await useDirectusAdmin();
  await directus.request(deleteItems("csa_membership", { limit: 1000 }));
  await directus.request(deleteItems("csa_share_type", { limit: 1000 }));
  await directus.request(deleteItems("csa_share_size", { limit: 1000 }));

  await directus.request(
    deleteItems("csa_share_of_membership", { limit: 1000 }),
  );

  await directus.request(deleteItems("csa_depot", { limit: 1000 }));
  await directus.request(deleteItems("collectivo_tiles", { limit: 1000 }));


  let exampleTypeID = 1;

  //create example data for csa_share_type
  try {
    await directus
      .request(
        createItem("csa_share_type", { csa_share_type_name: "Gemüseanteil" }),
      )
      .then((response) => {
        console.info(response);
        exampleTypeID = response.id;
      });

    console.info("created example data for csa_share_type");
  } catch (error) {
    console.info(error);
  }

  //create example data for csa_share_size
  try {
    await directus.request(
      createItem("csa_share_size", {
        csa_share_size_name: "klein",
        of_type: exampleTypeID,
      }),
    );

    await directus.request(
      createItem("csa_share_size", {
        csa_share_size_name: "groß",
        of_type: exampleTypeID,
      }),
    );

    console.info("created example data for csa_share_type");
  } catch (error) {
    console.info(error);
  }

  //create example data for csa_depot
  const depots = [
    "Limes",
    "Impact Café",
    "Melanchton Akademie",
    "Tante Olga Sülz",
    "Tante Olga Nippes",
  ];

  for (const depot of depots) {
    console.info("adding", depot, "of type: ", typeof depot);

    try {
      await directus.request(
        createItem("csa_depot", { csa_depot_name: depot }),
      );

      console.info("created example data for csa-depots");
    } catch (error) {
      console.info(error);
    }
  }

  try {
    await directus.request(createItem("collectivo_tiles", {tiles_name:"nächste Anteil",tiles_status:"published",tiles_component:"csaShareTile"}));
    console.info("created csaTile");
  } catch (error) {
    console.info(error);
  }

  //create example data for csa_delivery

  /*  const directus = await useDirectusAdmin();
    const exampleMemberships = [ "mambo nr 6", "abholgemeinschaft süd", "abholgemeinschaft nord", "abholgemeinschaft west", "abholgemeinschaft ost"];

    // creating example data for csa-memberships
    await directus.request(deleteItems("csaMembership", { limit: 1000 }));

    const memberships = [];

    for (const membership of exampleMemberships){
        console.info("adding", membership, "of type: ", typeof membership);

        memberships.push({
            csaMembership_name: membership,
        });
    } 

    try {
        await directus.request(createItems("csaMembership", memberships));

        console.info("created example data for csa-memberships");
    } catch (error) {
        console.info(error);    
    } */

  /*  console.info("creating example data for csa-tiles");


      // Create some tiles
  console.info("Creating tiles");
  await directus.request(deleteItems("collectivo_tiles", { limit: 1000 }));
  const tileNames = ["CSA Anteil", "News", "Tile 3", "Tile 4"];
  const tiles = [];

  for (const tileName of tileNames) {
    tiles.push({
      name: tileName,
      content: "Hello! I am an example tile!",
    });
  }

  try {
    await directus.request(createItems("collectivo_tiles", tiles));
  } catch (error) {
    console.info(error);
  } */
}
