import { useContext, useState } from "react";
import { Box, Text } from "grommet";
import StarRatings from "react-star-ratings";
import { ThemeContext } from "grommet";
import { hexToRGBA } from "./utils/functions";
import Context from "./utils/context";

const FavoritesListItem = ({ item, itemId }) => {
    const theme = useContext(ThemeContext);
    const context = useContext(Context);

    const handleChangeRating = (newRating, name) => {
        context.handleChangeRating(itemId, newRating)
    };

    return (
        <Box fill direction='row' align='center' justify='between' width='medium'>
            <Text size='medium'>{item.idea}</Text>
            <StarRatings
                rating={item.rating}
                starRatedColor={theme.global.colors["accent-1"]}
                starHoverColor={hexToRGBA(theme.global.colors["accent-1"], 0.7)}
                starEmptyColor='rgba(0,0,0,0.3)'
                changeRating={handleChangeRating}
                numberOfStars={5}
                name='rating'
                starDimension='16px'
                starSpacing='2px'
            />
        </Box>
    );
};

export default FavoritesListItem;
