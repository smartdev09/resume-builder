"use server";

import getSession from "utils/getSession";
import prisma from "utils/prisma";
import { UpdateProfileValues, updateProfileSchema } from "utils/validations";
import { revalidatePath } from "next/cache";

// To learn more about server actions, watch my YT tutorial: https://www.youtube.com/watch?v=XD5FpbVpWzk

export async function updateProfile(values: UpdateProfileValues) {
  const session = await getSession();
  const userId = session?.user?.id;

  if(userId) throw Error('Unauthorized')
  
  const { name } = updateProfileSchema.parse(values);

  // TODO: Update user
  await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name
        }
  });

  revalidatePath('/')
}