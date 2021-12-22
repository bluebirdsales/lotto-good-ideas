import { Box, Heading, ThemeContext } from "grommet";
import StarRatings from "react-star-ratings";
import { hexToRGBA } from "./utils/functions";
import { useContext } from "react";

const FavoritesAccordionLabel = ({ item, itemId, handleChangeRating }) => {
    const theme = useContext(ThemeContext);
    return (
        <Box fill direction='row' align='center' justify='between'>
            <Heading level='4'>{item.idea}</Heading>
            <StarRatings
                rating={item.rating}
                starRatedColor={theme.global.colors["accent-1"]}
                starHoverColor={hexToRGBA(theme.global.colors["accent-1"], 0.7)}
                starEmptyColor='rgba(0,0,0,0.3)'
                changeRating={handleChangeRating}
                numberOfStars={5}
                name={itemId}
                starDimension='16px'
                starSpacing='2px'
            />
        </Box>
    );
};

export default FavoritesAccordionLabel;
