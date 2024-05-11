import { readItems } from "@directus/sdk";
import { getUTCDate } from "./csaUtils";

const directus = useDirectus();

export async function getDefaultPickUpsOfDepotAndShareSize(
  shareSizeId: number,
  depotId: number
): Promise<csaShareOfMembership[]> {
  const result = await directus.request(
    readItems("csa_share_of_membership", {
      filter: {
        of_share_size: {
          _eq: shareSizeId,
        },
        default_depot: {
          _eq: depotId,
        },
      },
    })
  );

  return result;
}

export async function getSharesOfMembershipByShareSize(shareSizeId: number): Promise<csaShareOfMembership[]> {
  const directus = useDirectus();

  const sharesOfMembership = await directus.request(
    readItems("csa_share_of_membership", {
      filter: {
        of_share_size: {
          _eq: shareSizeId,
        },
      },
    })
  );

  return sharesOfMembership;

}

export async function getRecurringShareInstanceExceptionsByShareSize(
  shareSizeId: number,
  date: Date,
  depotId: number | null = null
) {
    const utcDate = getUTCDate(date);
  
    const sharesWithShareSize = await directus.request(
    readItems("csa_share_of_membership", {
      filter: {
        of_share_size: {
          _eq: shareSizeId,
        },
        default_depot: {
            _eq: depotId,
        }
      },
      
    })
  );

  const exceptions = Promise.all(
    sharesWithShareSize.map(
      async (share) =>

        await directus.request(
          readItems("csa_share_of_membership_exception", {
            filter: {
              date_of_share_exception: {
                _eq: utcDate,
              },
              of_share_of_membership: {
                _eq: share.id,
              },
            },
          })
        )
    )
  );

  return exceptions;
}
