import { useEffect } from 'react';
import { Brand } from '../../shared/Brand';
import $ from 'jquery';

import './styles.css';

export default function Splash(props) {
  useEffect(function () {
    if (props.loading) {
      const intro = $(".intro");
      const brand = $(".intro--brand");
      const subtitle = $(".intro--subtitle");

      $(function () {
        setTimeout(() => {
          brand.addClass("active");
        }, 400);

        setTimeout(() => {
          brand.removeClass("active");
          brand.addClass("fade");
        }, 3200);

        setTimeout(() => {
          subtitle.removeClass("active");
          subtitle.addClass("fade");
        }, 3400);

        setTimeout(() => {
          intro.css("top", "-100vh");
        }, 3700);
      });
    }
  }, []);

  return (
    <div className="intro text-center">
      <div className="intro--header">
        <h1 className="intro--brand">
          <Brand />
        </h1>
        <br />
        <h2 className="intro--subtitle animation-text-wipe animate-in">
          Built by RDO
        </h2>
      </div>
    </div>
  );
}