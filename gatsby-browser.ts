import 'sanitize.css';
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  domain: 'knpw.rs',
});

plausible.enableAutoPageviews();
plausible.enableAutoOutboundTracking();
