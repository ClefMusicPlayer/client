import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/index.module.css";

const Home: NextPage = () => {
  console.log(styles)
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
        />
        <title>Clef Home</title>
      </Head>
      <div className="d-block" style={{ height: "30px" }}>
        <div className="container" style={{ height: "30px" }}>
          <div className="row" style={{ height: "30px" }}>
            <div className="col-md-12" style={{ height: "30px" }}>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-10 offset-1">
        <div className="row">
          <div className="col text-center" style={{ paddingBottom: "30px" }}>
            <Image src="/logo.png" height="250" width="250" alt="logo" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h1 className="fw-normal text-center" style={{ fontSize: "30px" }}>
              Clef
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p style={{ textAlign: "center", fontSize: "24px" }}>
              Your music, Yours
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col" style={{ marginBottom: "27px" }}>
            <p
              style={{
                textAlign: "center",
                paddingBottom: 0,
                paddingRight: "10px",
                paddingLeft: "10px",
              }}
            >
              Enjoy music in its highest quality, Ad free and with an excellent
              recommendation engine
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col action__outer" style={{ marginBottom: "45px" }}>
            <h4 className="action__title">Explore</h4>
            <div className="row">
              <div className="col-11">
                <form action="/search">
                  <input
                    className={ styles.search }
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="Search Music ✨"
                    name="q"
                  />
                </form>
              </div>
              <div
                id="searchbutton"
                className="col-1 minicard-action"
                style={{ cursor: "pointer", textAlign: "right" }}
              >
                <i className="fa fa-search fs-2"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ marginBottom: "50px" }}>
          <div className="col action__outer" id="lastsong"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
