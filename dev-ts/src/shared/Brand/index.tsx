import { config } from "../../config";

export const NavBarBrand = () => {
  return (
      <div>
          <span className='brand--navbar'>
              <span className="accent-blue">{config.brand.front}</span>
              <span className="accent-green">{config.brand.back}</span>
          </span>
      </div>
  );
}

export const Brand = () => {
  return (
      <div>
          <span className='brand--normal'>
              <span className="accent-blue">{config.brand.front}</span>
              <span className="accent-green">{config.brand.back}</span>
          </span>
      </div>
  );
}