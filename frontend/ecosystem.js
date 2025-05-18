module.exports = {
    apps: [
        {
            name: "flepourtous-preprod",
            script: "npm",
            args: "run start",
            watch: true,
            env: {
                NODE_ENV: "development",
            },
        },
    ],
};
