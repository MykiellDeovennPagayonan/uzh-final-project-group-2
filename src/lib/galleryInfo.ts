const name = "yourName";
const artIs: ArtIs = ["Something1", "Something2"]; // words to decribe what art is
const artworks: Artwork[] = [
  {
    imageUrl: "/images/burg1.jpg", // image path and image name in /public
    title: "Burger 1", // title of artwork
    description: "Image of a burger from the internet", // description of artwork
  },
];

export {name, artIs, artworks}