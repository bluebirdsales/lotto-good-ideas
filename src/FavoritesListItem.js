import { useContext, useState } from "react";
import { AccordionPanel, Box, DropButton, Text } from "grommet";

import Context from "./utils/context";
import FavoritesAccordionLabel from "./FavoritesAccordionLabel";
import dayjs from "dayjs";
import { Trash } from "grommet-icons";
import DeleteDialog from "./DeleteDialog";

const FavoritesListItem = ({ item, itemId }) => {
    const context = useContext(Context);
    const [hovering, setHovering] = useState(false);

    const { saving } = context.favorites;

    const handleChangeRating = (newRating, name, e) => {
        e.stopPropagation();
        context.handleChangeRating(itemId, newRating);
    };

    const handleDelete = () => {
        if (context.favorites.saving) return;
        context.handleDeleteFavorite(itemId);
    };

    const handleHover = () => {
        setHovering(true);
    }

    const handleUnhover = () => {
        setHovering(false);
    }

    return (
        <AccordionPanel
            label={
                <FavoritesAccordionLabel
                    item={item}
                    handleChangeRating={handleChangeRating}
                    itemId={itemId}
                    hovering={hovering}
                />
            }
            fill
            direction='row'
            align='center'
            justify='between'
            width='medium'
            onMouseOver={handleHover}
            onMouseOut={handleUnhover}
            onFocus={handleHover}
            onBlur={handleUnhover}
        >
            <Box direction='row' align='center' justify='between' fill>
                <Box direction='row'>
                    {item.category1[0].length ? (
                        <Text margin={{ right: "medium" }}>{item.category1[0]}</Text>
                    ) : null}
                    {item.category2[0].length ? (
                        <Text>
                            {item.category2[0]} + {item.category2[1]}
                        </Text>
                    ) : null}
                </Box>
                <Box direction='row' align='center'>
                    <Text margin={{ horizontal: "medium" }}>
                        {dayjs.unix(item.created.seconds).format("ddd MMM DD, YYYY hh:mm a")}
                    </Text>
                    <DropButton
                        icon={<Trash size='small' />}
                        size='small'
                        margin={{ horizontal: "12px" }}
                        dropAlign={{ top: "bottom", right: "right" }}
                        dropContent={<DeleteDialog handleDelete={handleDelete} />}
                        dropProps={{ round: "small" }}
                        disabled={saving}
                    />
                </Box>
            </Box>
        </AccordionPanel>
    );
};

export default FavoritesListItem;
