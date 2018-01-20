import View from './view';

export default class Listing extends View {

    display(id, success, failure) {
        return super.display('listing', success, failure);
    }

}
