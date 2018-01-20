import View from './view';

export default class Info extends View {

    display(id, success, failure) {
        return super.display(`info/${id}`, success, failure);
    }

}
