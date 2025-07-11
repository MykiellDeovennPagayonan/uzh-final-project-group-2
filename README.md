# Mokoto Devcon ICP Full Stack Template

This is a Next.js-based full-stack template for building applications on the Internet Computer (ICP) using Mokoto.

## Features

- **Next.js 15** - Modern React framework for server-side rendering and static site generation.
- **Mokoto** - Integration with ICP for decentralized applications.
- **Canisters** - Backend services deployed on the Internet Computer.
- **Tailwind CSS** - Utility-first CSS framework for styling.
- **Typescript** - Type-safe development environment.
- **IC SDK** - Internet Computer SDK for interacting with canisters.

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v20 or later)
- DFX SDK (for deploying to ICP)
- Yarn or npm

### Clone the Repository
```sh
git clone https://github.com/MykiellDeovennPagayonan/art-gallery-icp-activity
cd art-gallery-icp-activity
```

### Install Dependencies
```sh
yarn install
# or
npm install
```

## Running the Development Server

Start the local Internet Computer replica, create the backend canister, and then start the development server:
```sh
dfx start --background
```
```sh
dfx canister create backend
```
```sh
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to the Internet Computer

To deploy your application:
```sh
dfx start --background
```
```sh
dfx deploy
```

## Environment Variables

Create a `.env.local` file and add the following variable:
```
NEXT_PUBLIC_CANISTER_ID_BACKEND=<your_backend_canister_id>
```
You can obtain `<your_backend_canister_id>` by running `dfx canister create backend`.

## Contributing

Feel free to submit pull requests and issues to improve the template.

## License

This project is licensed under the MIT License.