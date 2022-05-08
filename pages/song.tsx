/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/player.module.css";

import { useState } from "react";
import { Search, ArrowLeft } from "tabler-icons-react";
import Player from "../components/player";
import { Button, TextInput } from "@mantine/core";

const Song: NextPage = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <Head>
        <title>Clef Player</title>
      </Head>
      <div className={styles.nav}>
        <Link href="/">
          <div
            className="text-center self-center"
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft />
          </div>
        </Link>
        <div className="text-center" style={{ padding: 0 }}>
          {!showSearch ? (
            <h5 className="top-text text-2xl">Currently Playing</h5>
          ) : (
            <form>
              <TextInput
                className="search-bar"
                type="text"
                style={{ padding: "3px 5px" }}
                placeholder="Search Music ✨"
                name="q"  
              />
            </form>
          )}
        </div>
        <div
          id="searchbutton"
          className=" text-center align-self-center"
          style={{ cursor: "pointer" }}
        >
          <Button onClick={() => setShowSearch(!showSearch)}>
            <Search />
          </Button>
        </div>
      </div>
      <div className="d-block" style={{ height: 30 }}>
        <div className="container" style={{ height: 30 }}>
          <div className="row" style={{ height: 30 }}>
            <div className="col-md-12" style={{ height: 30 }}>
              <div />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <Player />
      </div>
      <div className="d-block" style={{ height: 30 }}>
        <div className="container" style={{ height: 30 }}>
          <div className="row" style={{ height: 30 }}>
            <div className="col-md-12" style={{ height: 30 }}>
              <div />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="" id="recommendations">
          <h2 style={{ marginBottom: 17, marginLeft: "1rem" }}>Up next</h2>
        </div>
      </div>
      <div id="player" />
    </>
  );
};
export default Song;
