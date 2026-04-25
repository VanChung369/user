import AuthenticationReducer, {
  namespace as AuthenticationNameSpace,
} from "./authentication/slice";
import ConfigSlice, { namespace as ConfigNamespace } from "./config/slice";
import AddressSlice, { namespace as AddressNamespace } from "./address/slice";
import ConnectionSlice, {
  namespace as ConnectionNamespace,
} from "./connection/slice";
import ActionSlice, { namespace as ActionNamespace } from "./action/slice";
import { combineReducers } from "redux";

export default combineReducers({
  [ConfigNamespace]: ConfigSlice,
  [AddressNamespace]: AddressSlice,
  [ConnectionNamespace]: ConnectionSlice,
  [AuthenticationNameSpace]: AuthenticationReducer,
  [ActionNamespace]: ActionSlice,
});
