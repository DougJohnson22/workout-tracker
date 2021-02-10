function renderExcerciseplans() {
    $("#plans").empty();
    $.ajax({
        url: "/populatedplans",
        method: "GET",
    })
        .then(dbData => {
            console.log(dbData)
            dbData.forEach(plan => {
                // make a new div each workout
                const newDiv = $('<div>', {
                    style: 'width: 25%; border: 2px solid blue',
                })
                const title = $("<h3>", {
                    text: plan.name
                })
                const newUl = $("<ul>", { text: 'Workout Plans!' })
                newDiv.append(title)


                // loop through Excercises and print each
                plan.excercise.forEach(Excercise => {
                    const newLi = $("<li>", {
                        text: `Name: ${Excercise.name}\nLength(in min): ${Excercise.length}\nIs it Cardio: ${Excercise.isCardio ? 'Yes it is!' : 'No it isn\'t!'}\nIs it Strength? ${Excercise.isStrength ? "Yes it is!" : "No it isnt!"}`
                    })
                    newUl.append(newLi);
                })
                // FORM to add new Excercises to the plan
                const newForm = $('<form class="">', {
                    id: plan._id
                })
                const newBtn = $("<button>", {
                    text: 'Add Excercise...',
                    class: 'button',
                    'data-id': plan._id
                })
                const nameInput = $("<input>", {
                    type: 'text',
                    id: `name-${plan._id}`,
                    placeholder: 'New Excercise name..'
                })
                const lengthLabel = $("<label>", {
                    for: `length-${plan._id}`,
                    text: 'Length of exercise in minutes: '
                })
                const lengthInput = $("<input>", {
                    type: 'number',
                    id: `length-${plan._id}`
                })
                const cardioLabel = $("<label>", {
                    for: `cardio-${plan._id}`,
                    text: 'Is it Cardio? Click if true.'
                })
                const cardioInput = $("<input>", {
                    type: 'checkbox',
                    id: `cardio-${plan._id}`
                })
                const strengthLabel = $("<label>", {
                    for: `strength-${plan._id}`,
                    text: 'Is it Strength? Click if true.'
                })
                const strengthInput = $("<input>", {
                    type: 'checkbox',
                    id: `strength-${plan._id}`
                })

                newForm
                    .append(nameInput)
                    .append(lengthLabel)
                    .append(lengthInput)
                    .append(cardioLabel)
                    .append(cardioInput)
                    .append(strengthLabel)
                    .append(strengthInput)
                    .append(newBtn)

                newDiv
                    .append(newUl)
                    .append(newForm);


                $("#plans").append(newDiv);
            })
        })
}
renderExcerciseplans();

$("#new-plan").on('submit', (e) => {
    e.preventDefault();
    const planname = $("#plan-name").val().trim();
    console.log(planname);
    $.ajax({
        url: "/api/plans",
        method: "POST",
        data: { name: planname }
    })
        .then(renderExcerciseplans())
})

$("#plans").on('click', ".update-btn", (e) => {
    e.preventDefault();
    const planId = e.target.dataset.id;
    console.log(planId);
    const name = $(`#name-${planId}`).val().trim();
    const length = parseInt($(`#length-${planId}`).val())
    const isCardio = $(`#cardio-${planId}`).is(":checked");
    const isStrength = $(`#strength-${planId}`).is(":checked");

    const newObj = {
        name, length, isCardio, isStrength, planId
    }

    console.log(newObj);

    $.ajax({
        url: "/api/excercises",
        method: "POST",
        data: newObj
    })
        .then(dbExcercises => {
            console.log(dbExcercises)
            renderExcerciseplans();
        })
        .catch(err => {
            console.log(err);
        })

})