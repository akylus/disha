import React, { Component } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  makeStyles,
  Avatar,
  Grid,
  Tooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { deepOrange, deepPurple, grey } from "@material-ui/core/colors";
import "./styles.css";

const Styles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: "#ffffff",
    backgroundColor: "#F9A825",
  },
}));

const getInitials = (fullName) => {
  const words = fullName.split(" ");
  if (words.length > 1) return words[0][0] + words[1][0];
  else return words[0][0];
};

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    maxWidth: 220,
    fontSize: "16px",
  },
}))(Tooltip);

export default function UserCard(props) {
  const classes = Styles();
  // console.log(getInitials(props.title))
  return (
    <Box
      boxShadow={2}
      borderColor="primary"
      borderRadius={16}
      style={{
        margin: "0.5rem",
      }}
    >
      <Card
        variant="outlined"
        style={{
          width: "20rem",
          minHeight: "5rem",
        }}
        className="grow"
      >
        <HtmlTooltip
          title={
            <Typography align="left" noWrap>
              {props.title}
            </Typography>
          }
          placement="bottom"
        >
          <CardContent
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Avatar className={classes.purple}>
                {getInitials(props.title)}
              </Avatar>
              <Box style={{ width: "70%" }}>
                <Typography className="userName" align="left" noWrap>
                  {props.title}
                </Typography>
                <Typography align="left" noWrap style={{ color: grey[500] }}>
                  {props.isAlumni ? "Alumni" : "Student"} • {props.department}
                </Typography>
              </Box>
            </Grid>
          </CardContent>
        </HtmlTooltip>
      </Card>
    </Box>
  );
}
