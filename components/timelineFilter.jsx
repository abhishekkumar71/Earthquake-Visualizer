import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { Tooltip } from "@mui/material";
const timelineOptions = [
  { label: "Past 24 Hours", value: "all_day" },
  { label: "Past 7 Days", value: "all_week" },
  { label: "Past 30 Days", value: "all_month" },
];

export default function TimelineFilter({ timeline, setTimeline }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const selectedIndex = timelineOptions.findIndex(
    (opt) => opt.value === timeline
  );

  const handleClick = () => {
    console.info(`Selected timeline: ${timelineOptions[selectedIndex].label}`);
  };

  const handleMenuItemClick = (event, index) => {
    setTimeline(timelineOptions[index].value);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="absolute top-[1rem] left-[4rem] z-[550]">
      <React.Fragment>
        <Tooltip title="Time Range" arrow>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="Timeline filter button group"
          >
            <Button onClick={handleClick} sx={{ backgroundColor: "#616161" }}>
              {timelineOptions[selectedIndex]?.label}
            </Button>
            <Button
              size="small"
              sx={{ backgroundColor: "#616161" }}
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select timeline"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
        </Tooltip>
        <Popper
          sx={{ zIndex: 550 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {timelineOptions.map((option, index) => (
                      <MenuItem
                        key={option.value}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </React.Fragment>
    </div>
  );
}
