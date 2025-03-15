"use server";

export const getUsers = async () => {
    const response = await fetch("http://flepourtous.localhost/users");
    console.log(response);
    return response.json();
};
