# build typescript application
FROM node:14 AS ts-build
WORKDIR /app

# install deps
COPY package.json .
COPY package-lock.json .
RUN npm install

# copy sources
COPY tsconfig.json .
COPY src/ ./src

# run typescript compiler
RUN npm run build

# build runtime container
FROM nixos/nix AS runtime
WORKDIR /app

# Update nix
RUN nix-channel --add https://nixos.org/channels/nixpkgs-unstable nixpkgs
RUN nix-channel --update

# install
RUN nix-env -iA nixpkgs.nodejs-14_x

# install neuron
RUN nix-env -iA cachix -f https://cachix.org/api/v1/install
RUN cachix use srid
RUN nix-env -if https://github.com/srid/neuron/archive/master.tar.gz

# install application
COPY package.json .
COPY package-lock.json .
RUN npm install --only=production

COPY --from=ts-build /app/build .
CMD [ "node", "index.js" ]
