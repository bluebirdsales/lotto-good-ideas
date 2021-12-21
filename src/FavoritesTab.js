import { Box, Heading, List } from "grommet";
import { useContext } from "react";
import FavoritesListItem from "./FavoritesListItem";
import Context from "./utils/context";

const FavoritesTab = () => {
    const context = useContext(Context);

    const { savedIdeas } = context.favorites;

    const sortedFaves = Object.keys(savedIdeas).sort((a, b) => {
        const textA = savedIdeas[a].idea.toLowerCase();
        const textB = savedIdeas[b].idea.toLowerCase();
        console.log(textA, textB);
        return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    console.log("sorted", sortedFaves);

    return (
        <Box
            background={{ color: "primary" }}
            pad={{ horizontal: "medium", vertical: "none" }}
            flex
        >
            <Heading level='3'>Favorites</Heading>
            <Box>
                <List data={sortedFaves}>
                    {(key, index) => (
                        <FavoritesListItem
                            item={context.favorites.savedIdeas[key]}
                            itemId={key}
                            key={`${key}`}
                        />
                    )}
                </List>
            </Box>
        </Box>
    );
};

export default FavoritesTab;
