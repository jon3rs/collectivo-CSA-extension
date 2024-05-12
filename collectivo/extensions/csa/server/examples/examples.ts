import { createItem, createItems, deleteItems } from "@directus/sdk";

// This function can be used to create example data for your extension
export default async function examples() {
  const directus = await useDirectusAdmin();
  await directus.request(deleteItems("csa_membership", { limit: 1000 }));
  await directus.request(deleteItems("csa_share_type", { limit: 1000 }));
  await directus.request(deleteItems("csa_share_size", { limit: 1000 }));

  await directus.request(
    deleteItems("csa_share_of_membership", { limit: 1000 })
  );

  await directus.request(
    deleteItems("csa_share_of_membership_exception", { limit: 1000 })
  );

  await directus.request(deleteItems("csa_depot", { limit: 1000 }));
  //await directus.request(deleteItems("collectivo_tiles", { limit: 1000 }));

  // Create some users
/*   console.info("Creating users");

  const userNames = [
    "Admin",
    "Editor",
    "User",
    "Alice",
    "Bob",
    "Charlie",
    "Dave",
  ];

  const users = [];

  for (const userName of userNames) {
    const email = `${userName.toLowerCase()}@example.com`;

    const u = {
      first_name: userName,
      last_name: "Example",
      email: email,
      role: userRole,
      provider: "keycloak",
      status: "active",
      external_identifier: email,
    };

    if (userName == "Admin") {
      u.role = adminRole;
    }

    if (userName == "Editor") {
      u.role = editorRole;
    }

    users.push(u);
  }

  for (const user of users) {
    const usersDB = await directus.request(
      readUsers({
        filter: { email: { _eq: user.email } },
      })
    );

    let userID;

    if (usersDB.length > 0) {
      userID = usersDB[0].id;
      // tslint:disable-next-line:no-console
      console.info("Updating user " + user.email + " with ID " + userID);
      await directus.request(updateUser(userID, user));
      // tslint:disable-next-line:no-console
      console.info("Updated good");
    } else {
      // tslint:disable-next-line:no-console
      console.info("Creating user " + user.email);
      const us = await directus.request(createUser(user));
      userID = us.id;
    }
  } */

  let exampleTypeID = 1;

  //create example data for csa_share_type
  try {
    await directus
      .request(
        createItem("csa_share_type", { csa_share_type_name: "Gemüseanteil" })
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
      })
    );

    await directus.request(
      createItem("csa_share_size", {
        csa_share_size_name: "groß",
        of_type: exampleTypeID,
      })
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
        createItem("csa_depot", { csa_depot_name: depot })
      );

      console.info("created example data for csa-depots");
    } catch (error) {
      console.info(error);
    }
  }

/*   const memberships = [];

  for (const user of users) {
    try {
      const membership = await directus.request(
        createItem("csa_membership", { csa_membership_of: user.userID })
      );
      memberships.push(membership);
      console.info("created example data for csa-memberships");
    } catch (error) {
      console.info(error);
    }
  }

  for (const membership in memberships) {
    try {
      await directus.request(
        createItem("csa_share_of_membership", {
          of_membership: membership.id,
          of_share_size: 1 + Math.round(Math.random()),
          default_depot: Math.round(),
        })
      );
      console.info("created example data for csa-shares");
    } catch (error) {
      console.info(error);
    }
  }
 */
 /*  try {
    await directus.request(
      createItem("collectivo_tiles", {
        tiles_name: "nächste Anteil",
        tiles_status: "published",
        tiles_component: "csaShareTile",
      })
    );

    await directus.request(
      createItem("collectivo_tiles", {
        tiles_name: "Kommissionierung",
        tiles_status: "published",
        tiles_component: "csaCommissioningTile",
      })
    );

    console.info("created csaTile");
  } catch (error) {
    console.info(error);
  } */

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
