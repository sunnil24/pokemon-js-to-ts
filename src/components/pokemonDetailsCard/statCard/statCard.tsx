import PropTypes from "prop-types";
import { Col, Grid, Row } from "rsuite";
import { getCamleCaseString } from "../../../constants/pokemon.types";
import "./statCard.scss";

const StatCard = ({ stats }: any) => {
  const getStatHeading = (name) => {
    if (name === "hp") {
      return "HP";
    } else {
      const [firstName, lastName] = name.split("-");
      if (firstName === "special" && lastName)
        return "Sp. " + getCamleCaseString(lastName);
      else return getCamleCaseString(firstName);
    }
  };
  return (
    <>
      <div className="stat-container">
        <div className="stat-card">
          <div>
            <span className="stat-header">Stats</span>
          </div>
          <div>
            <Grid fluid>
              <Row className="show-grid">
                {stats &&
                  stats.map((item) => (
                    <Col
                      key={item.stat.name}
                      className="pl-0 pt-1"
                      lg={12}
                      xl={12}
                      xs={24}
                      sm={24}
                    >
                      <div className="stat-flex-row">
                        <Col xs={4} lg={8} xl={8} className="pl-0 pr-0">
                          <div>
                            <span className="prop-header">
                              {getStatHeading(item.stat.name)}
                            </span>
                          </div>
                        </Col>
                        <Col xs={8} lg={10} xl={10} className="pl-0 pr-0">
                          <div className="prop-header-data">
                            <span className="stat-data">{item.base_stat}</span>
                            <progress value={item.base_stat} max="100">
                              {item.base_stat}
                            </progress>
                          </div>
                        </Col>
                      </div>
                    </Col>
                  ))}
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

StatCard.propTypes = {
  stats: PropTypes.array,
};

export default StatCard;
