import { ReactElement, useEffect, useState, useRef } from "react";
import { number, func } from "prop-types";
import { usdFormatter } from "@constants";
import { HighlightedText } from "@shared/styles";

interface TimerProps {
  burnMin: number;
  seconds: number;
  setSeconds(seconds: (prevSeconds: number) => number): void;
}

const formatSecsToMins = (seconds: number): string =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const Timer = ({ burnMin, seconds, setSeconds }: TimerProps): ReactElement => {
  const burnRateSec = useRef(burnMin / 60);
  const [total, setTotal] = useState(burnRateSec.current * seconds || 0);

  const burnMinPretty = usdFormatter.format(burnMin);

  useEffect(() => {
    burnRateSec.current = burnMin / 60;
  }, [burnMin]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds: number) => prevSeconds + 1);
      setTotal((prevTotal) => prevTotal + burnRateSec.current);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [setSeconds]);

  return (
    <>
      BURNS AT <HighlightedText>{burnMinPretty}</HighlightedText>
      <br />
      FOR <HighlightedText>{formatSecsToMins(seconds)}</HighlightedText>
      <br />
      <HighlightedText fontSize="4rem">
        {usdFormatter.format(total)}
      </HighlightedText>
      <br />
      HAS BEEN BURNT
    </>
  );
};

Timer.propTypes = {
  burnMin: number.isRequired,
  seconds: number.isRequired,
  setSeconds: func.isRequired,
};

export default Timer;
